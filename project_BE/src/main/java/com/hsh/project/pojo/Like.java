package com.hsh.project.pojo;

import com.hsh.project.pojo.enums.EnumLikeType;
import com.hsh.project.pojo.enums.EnumTargetType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "Likes")
public class Like extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long likeID;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    User user;

    @Enumerated(EnumType.STRING)
    EnumTargetType targetType; // Review hay Comment

    Long targetId; // review_id hay comment_id

    @Enumerated(EnumType.STRING)
    EnumLikeType type;

}
